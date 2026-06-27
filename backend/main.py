from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware to allow requests from http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Pipeline(BaseModel):
    nodes: list
    edges: list

def find_cycle_path(adj, node_ids):
    visited = set()
    rec_stack = []
    
    def dfs(node, path):
        visited.add(node)
        rec_stack.append(node)
        for neighbor in adj.get(node, []):
            if neighbor not in visited:
                result = dfs(neighbor, path)
                if result:
                    return result
            elif neighbor in rec_stack:
                # Found cycle - slice from where it starts
                cycle_start = rec_stack.index(neighbor)
                return rec_stack[cycle_start:] + [neighbor]
        rec_stack.pop()
        return None
    
    for node in node_ids:
        if node not in visited:
            result = dfs(node, [])
            if result:
                return result
    return []

def get_node_label(node_id: str) -> str:
    parts = node_id.rsplit('-', 1)
    type_name = parts[0]
    if type_name.startswith('custom'):
        type_name = type_name[6:]
    
    lower_name = type_name.lower()
    if lower_name == 'llm':
        return 'LLM'
    if lower_name == 'aiimage':
        return 'AI Image'
        
    return type_name[0].upper() + type_name[1:] if type_name else ""

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    # Kahn's Algorithm for DAG detection
    node_ids = {node["id"] for node in pipeline.nodes}
    in_degree = {node_id: 0 for node_id in node_ids}
    adj = {node_id: [] for node_id in node_ids}

    for edge in pipeline.edges:
        src = edge.get("source")
        tgt = edge.get("target")
        # Ensure we only track edges connecting active nodes
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    # Queue all nodes with in-degree 0
    queue = [node_id for node_id in node_ids if in_degree[node_id] == 0]
    visited_count = 0

    while queue:
        curr = queue.pop(0)
        visited_count += 1
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    is_dag = (visited_count == len(pipeline.nodes))

    cycle_path_string = ""
    if not is_dag:
        path = find_cycle_path(adj, node_ids)
        if path:
            steps = []
            for i in range(len(path) - 1):
                src = path[i]
                tgt = path[i+1]
                connecting_edge = None
                for edge in pipeline.edges:
                    if edge.get("source") == src and edge.get("target") == tgt:
                        connecting_edge = edge
                        break
                
                if not connecting_edge:
                    src_label = get_node_label(src)
                    steps.append(f"{src_label} (unknown)")
                    continue
                
                src_label = get_node_label(src)
                source_handle = connecting_edge.get("sourceHandle", "")
                src_handle_name = source_handle
                if src_handle_name.startswith(f"{src}-"):
                    src_handle_name = src_handle_name[len(src) + 1:]
                
                steps.append(f"{src_label} ({src_handle_name})")
                
                if i == len(path) - 2:
                    tgt_label = get_node_label(tgt)
                    target_handle = connecting_edge.get("targetHandle", "")
                    tgt_handle_name = target_handle
                    if tgt_handle_name.startswith(f"{tgt}-"):
                        tgt_handle_name = tgt_handle_name[len(tgt) + 1:]
                    steps.append(f"{tgt_label} ({tgt_handle_name})")
            cycle_path_string = " → ".join(steps)

    return {
        "num_nodes": len(pipeline.nodes),
        "num_edges": len(pipeline.edges),
        "is_dag": is_dag,
        "cycle_path": cycle_path_string
    }
