"use server";

import OpenAI from "openai";
import type { Edge, MarkerType } from "reactflow";

const openai = new OpenAI();

const systemPrompt = `You need to create a diagram for a course.
The diagram is actually a body of an exercise, so it should be related to the course, lesson, and task, and make a learning material. 
Based on your inputs, you need to make a learning material for this task. Task would be interactive diagram that students need to complete.
Use your inputs as a source of ideas for the actually useful diagram. Be creative and use inputs just as a source of inspiration.

Diagram consists of nodes and edges.
Node types: Header, Definition, ProcessStages.
Each node requires an x and y position on the diagram. Start with 0, each block is around 200px wide, 100px high. Make sure that nodes do not overlap making a gap of at least 10px between them.
Header: {
  id: string uuid,
  position: { x: number, y: number },
  type: "Header",
  data: {
    header: "Header node"
  }
}
Definition: {
  id: string uuid,
  position: { x: number, y: number },
  type: "Definition",
  data: {
    header: "Definition node",
    definition: "Definition node definition"
  }
}
ProcessStages looks like a header and a list of terms on the client, can be used for this too.
ProcessStages: {
  id: string uuid,
  position: { x: number, y: number },
  type: "ProcessStages",
  data: {
    header: string,
    stages: [{ id: number, name: string }]
  }
}
Edge types: removable
Edge: {
  source: string, (id of the source node)
  target: string (id of the target node)
}

return a JSON object that consists of two keys: nodes and edges, arrays.
`;

export async function generateDiagram({
  courseName,
  courseDescription,
  lessonName,
  lessonDescription,
  taskId,
  taskName,
  taskDescription,
}: {
  courseName: string;
  courseDescription: string;
  lessonName: string;
  lessonDescription: string;
  taskId: string;
  taskName: string;
  taskDescription: string;
}) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `course name: ${courseName}
      course description: ${courseDescription}
      lesson name: ${lessonName}
      lesson description: ${lessonDescription}
      task name: ${taskName}
      task description: ${taskDescription}
      `,
      },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });
  const response = chatCompletion.choices[0].message.content || "{}";

  const { nodes, edges } = JSON.parse(response);
  const edgesWithIdAndType = edges.map(
    (edge: { source: string; target: string }): Edge => ({
      id: `${edge.source}-${edge.target}`,
      type: "removable",
      source: edge.source,
      target: edge.target,
      markerEnd: { type: "arrowclosed" as MarkerType, width: 20, height: 20 },
      data: {
        taskId,
        diagramVariant: "answer",
      },
    }),
  );
  return { nodes, edges: edgesWithIdAndType };
}
