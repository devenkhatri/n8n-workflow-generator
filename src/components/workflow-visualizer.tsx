'use client';

import React, { useMemo, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  ConnectionLineType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  credentials?: object;
  parameters?: object;
}

interface N8nConnection {
  main: [Array<{ node: string; main: [Array<any>|any] }>];
}

interface N8nWorkflow {
  nodes: N8nNode[];
  connections: N8nConnection;
}

interface WorkflowVisualizerProps {
  json: string;
}

// Function to parse the n8n workflow and extract nodes and edges
const parseWorkflow = (jsonString: string): { nodes: Node[], edges: Edge[] } => {
  try {
    const workflow: N8nWorkflow = JSON.parse(jsonString);
    if (!workflow.nodes || !workflow.connections) {
      return { nodes: [], edges: [] };
    }

    const reactFlowNodes: Node[] = workflow.nodes.map((node, index) => ({
      id: node.id,
      data: { label: `${node.name} (${node.type})` },
      position: { x: node.position[0], y: node.position[1] },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
      }
    }));

    const reactFlowEdges: Edge[] = [];
    const connectionEntries = Object.entries(workflow.connections);

    for (const [sourceNodeId, connectionData] of connectionEntries) {
      if (connectionData.main && connectionData.main[0]) {
        connectionData.main[0].forEach((connection: any) => {
          const targetNodeId = connection.node;
          const outputName = Object.keys(connection.main[0])[0];
          
          reactFlowEdges.push({
            id: `e-${sourceNodeId}-${targetNodeId}-${outputName}`,
            source: sourceNodeId,
            target: targetNodeId,
            label: outputName,
            type: ConnectionLineType.SmoothStep,
            markerEnd: { type: 'arrowclosed' },
             style: {
              stroke: 'hsl(var(--foreground))'
            }
          });
        });
      }
    }
    return { nodes: reactFlowNodes, edges: reactFlowEdges };
  } catch (error) {
    console.error("Failed to parse n8n workflow JSON:", error);
    return { nodes: [], edges: [] };
  }
};


export function WorkflowVisualizer({ json }: WorkflowVisualizerProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => parseWorkflow(json), [json]);

  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  React.useEffect(() => {
    const { nodes, edges } = parseWorkflow(json);
    setNodes(nodes);
    setEdges(edges);
  }, [json]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  if (!initialNodes.length) {
    return (
       <div className="flex items-center justify-center w-full h-full min-h-[300px] md:min-h-[400px] bg-muted/50 rounded-md">
        <p className="text-muted-foreground text-center">Could not parse workflow. <br/> Please check if the generated JSON is valid.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] rounded-md overflow-hidden border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
