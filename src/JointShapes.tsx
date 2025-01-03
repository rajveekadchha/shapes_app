
import React, { useEffect, useRef } from "react";
import * as joint from "jointjs";

export default function JointShapes(){
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paperRef.current) return;

    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
      el: paperRef.current,
      model: graph,
      width: "90vw",
      height: "80vh",
      background: { color: '#F5F5F5' },
      interactive: { labelMove: false }, // Prevent default label move
    });

    let lastLabel: joint.shapes.standard.TextBlock | null = null; // Track the last label

    // Function to handle click event and add a text box below the shape
    const handleClick = (element: joint.shapes.standard.Rectangle | joint.shapes.standard.Circle) => {
      // Remove previous label if it exists
      if (lastLabel) {
        lastLabel.remove();
      }

      const position = element.position();
      const { width, height } = element.size();
      
      const fillColor = element.attr('body/fill');
      const labelText = element.attr('label/text');

      let additionalText = "";

      // Check for circle
      if (element instanceof joint.shapes.standard.Circle) {
        const radius = element.size().width / 2; // Radius is half of width for circle
        additionalText = `Radius: ${radius}px, Shape: Circle`;
       } else if (element instanceof joint.shapes.standard.Rectangle) {
        additionalText = `Width: ${width}px, Height: ${height}px , Shape: Rectangle`;
       } 
      else {
        additionalText = `Width: ${width}px, Height: ${height}px`;
      }

      // Combine all the properties into one single line for the label
      const labelDetails = `Position: (${position.x}, ${position.y}) , ${additionalText} , Color: ${fillColor} , Label: ${labelText || 'None'}`;

      // Create a new label text box below the shape
      const label = new joint.shapes.standard.TextBlock();
      label.position(position.x, position.y + height + 10); // Position below the shape
      label.resize(200, 50); // Resize the label box
      label.attr({
        body: { fill: "lightgray" },
        label: { text: labelDetails, fill: "black", fontSize: 12 },
      });
      label.addTo(graph);

      // Update lastLabel to the current label
      lastLabel = label;

      // Update label position when the shape moves
      element.on('change:position', () => {
        const newPosition = element.position();
        label.position(newPosition.x, newPosition.y + height + 10);
      });
    };

    // Create shapes and add click events
    const createShape = (ShapeConstructor: any, x: number, y: number, color: string, text: string) => {
      const shape = new ShapeConstructor();
      shape.position(x, y);
      shape.resize(120, 100); // Default size for rectangle, circle
      shape.attr({
        body: { fill: color },
        label: { text, fill: "white" },
      });
      shape.addTo(graph);

      // Attach click event
      paper.on("element:pointerclick", (elementView: joint.dia.ElementView) => {
        if (elementView.model === shape) {
          handleClick(shape);
        }
      });
    };

    // Create the shapes
    createShape(joint.shapes.standard.Rectangle, 50, 50, "blue", "Click me!");
    createShape(joint.shapes.standard.Circle, 250, 50, "pink", "Click me!");

    return () => {
      graph.clear();
    };
  }, []);

  return <div ref={paperRef} />;
};




