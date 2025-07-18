// app/page-builder/page.tsx
"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { Rnd } from "react-rnd";

const defaultBlocks = [
  {
    type: "section",
    bgColor: "#f9fafb",
    padding: "p-6",
    margin: "mb-6",
    children: [
      {
        type: "heading",
        level: 1,
        content: "Welcome to My Website",
        textColor: "text-black",
        position: { x: 0, y: 0 },
        size: { width: 400, height: 100 },
      },
      {
        type: "paragraph",
        content: "This is a custom page builder example.",
        textColor: "text-gray-700",
        position: { x: 0, y: 120 },
        size: { width: 400, height: 100 },
      },
    ],
  },
];

function SortableBlock({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      <div {...listeners} className="absolute -left-6 top-4 cursor-move">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      {children}
    </div>
  );
}

export default function PageBuilder() {
  const [blocks, setBlocks] = useState(defaultBlocks);

  const addBlock = (sectionIndex: number, type: string) => {
    const newBlock =
      type === "heading"
        ? {
            type: "heading",
            level: 2,
            content: "",
            textColor: "text-black",
            position: { x: 0, y: 0 },
            size: { width: 300, height: 100 },
          }
        : type === "paragraph"
        ? {
            type: "paragraph",
            content: "",
            textColor: "text-gray-700",
            position: { x: 0, y: 0 },
            size: { width: 300, height: 100 },
          }
        : type === "image"
        ? {
            type: "image",
            url: "",
            alt: "",
            position: { x: 0, y: 0 },
            size: { width: 300, height: 200 },
          }
        : type === "button"
        ? {
            type: "button",
            label: "Click Me",
            link: "#",
            position: { x: 0, y: 0 },
            size: { width: 200, height: 50 },
          }
        : null;

    if (newBlock) {
      const updated = [...blocks];
      updated[sectionIndex].children.push(newBlock);
      setBlocks(updated);
    }
  };

  const addSection = () => {
    setBlocks([
      ...blocks,
      {
        type: "section",
        bgColor: "#ffffff",
        padding: "p-6",
        margin: "mb-6",
        children: [],
      },
    ]);
  };

  const updateBlock = (
    sectionIndex: number,
    blockIndex: number,
    value: any
  ) => {
    const updated = [...blocks];
    updated[sectionIndex].children[blockIndex] = value;
    setBlocks(updated);
  };

  const handleDragEnd = (event: any, sectionIndex: number) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const section = blocks[sectionIndex];
      const oldIndex = active.id;
      const newIndex = over.id;
      const newChildren = arrayMove(section.children, oldIndex, newIndex);
      const updated = [...blocks];
      updated[sectionIndex].children = newChildren;
      setBlocks(updated);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12 overflow-y-auto h-full">
      <h1 className="text-3xl font-bold">Page Builder</h1>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
        onClick={addSection}
      >
        + Add Section
      </button>

      {blocks.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className={`rounded shadow relative ${section.padding} ${section.margin}`}
          style={{
            backgroundColor: section.bgColor,
            position: "relative",
            minHeight: 300,
          }}
        >
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-1">
                Background
              </label>
              <input
                type="color"
                value={section.bgColor}
                onChange={(e) => {
                  const updated = [...blocks];
                  updated[sectionIndex].bgColor = e.target.value;
                  setBlocks(updated);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Padding</label>
              <input
                type="text"
                value={section.padding}
                onChange={(e) => {
                  const updated = [...blocks];
                  updated[sectionIndex].padding = e.target.value;
                  setBlocks(updated);
                }}
                className="border p-1 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Margin</label>
              <input
                type="text"
                value={section.margin}
                onChange={(e) => {
                  const updated = [...blocks];
                  updated[sectionIndex].margin = e.target.value;
                  setBlocks(updated);
                }}
                className="border p-1 rounded"
              />
            </div>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, sectionIndex)}
          >
            <SortableContext
              items={section.children.map((_, i) => i)}
              strategy={verticalListSortingStrategy}
            >
              {section.children.map((block, blockIndex) => (
                <SortableBlock key={blockIndex} id={blockIndex}>
                  <Rnd
                    size={block.size}
                    position={block.position}
                    onDragStop={(e, d) => {
                      const updated = [...blocks];
                      updated[sectionIndex].children[blockIndex].position = {
                        x: d.x,
                        y: d.y,
                      };
                      setBlocks(updated);
                    }}
                    onResizeStop={(e, dir, ref, delta, position) => {
                      const updated = [...blocks];
                      updated[sectionIndex].children[blockIndex].size = {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                      };
                      updated[sectionIndex].children[blockIndex].position =
                        position;
                      setBlocks(updated);
                    }}
                    bounds="parent"
                  >
                    <div className="border p-4 rounded space-y-2 bg-white">
                      {block.type === "heading" && (
                        <>
                          <select
                            value={block.level}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                level: Number(e.target.value),
                              })
                            }
                            className="border p-1 rounded"
                          >
                            <option value={1}>H1</option>
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Heading text"
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                content: e.target.value,
                              })
                            }
                            className={`w-full border-b text-xl font-bold ${block.textColor}`}
                          />
                          <input
                            type="text"
                            value={block.textColor}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                textColor: e.target.value,
                              })
                            }
                            placeholder="e.g. text-red-500"
                            className="border p-1 rounded"
                          />
                        </>
                      )}
                      {block.type === "paragraph" && (
                        <>
                          <textarea
                            placeholder="Paragraph"
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                content: e.target.value,
                              })
                            }
                            className={`w-full border rounded p-2 ${block.textColor}`}
                          />
                          <input
                            type="text"
                            value={block.textColor}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                textColor: e.target.value,
                              })
                            }
                            placeholder="e.g. text-blue-600"
                            className="border p-1 rounded"
                          />
                        </>
                      )}
                      {block.type === "image" && (
                        <>
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={block.url}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                url: e.target.value,
                              })
                            }
                            className="w-full border rounded p-2"
                          />
                          <input
                            type="text"
                            placeholder="Alt text"
                            value={block.alt}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                alt: e.target.value,
                              })
                            }
                            className="w-full border rounded p-2"
                          />
                          {block.url && (
                            <img
                              src={block.url}
                              alt={block.alt}
                              className="w-full rounded"
                            />
                          )}
                        </>
                      )}
                      {block.type === "button" && (
                        <>
                          <input
                            type="text"
                            placeholder="Button Label"
                            value={block.label}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                label: e.target.value,
                              })
                            }
                            className="border p-2 rounded w-full"
                          />
                          <input
                            type="text"
                            placeholder="Button Link"
                            value={block.link}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                link: e.target.value,
                              })
                            }
                            className="border p-2 rounded w-full"
                          />
                          <a
                            href={block.link}
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded mt-2"
                          >
                            {block.label}
                          </a>
                        </>
                      )}
                    </div>
                  </Rnd>
                </SortableBlock>
              ))}
            </SortableContext>
          </DndContext>

          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={() => addBlock(sectionIndex, "heading")}
            >
              + Heading
            </button>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={() => addBlock(sectionIndex, "paragraph")}
            >
              + Paragraph
            </button>
            <button
              className="bg-indigo-600 text-white px-4 py-1 rounded"
              onClick={() => addBlock(sectionIndex, "image")}
            >
              + Image
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-1 rounded"
              onClick={() => addBlock(sectionIndex, "button")}
            >
              + Button
            </button>
          </div>
        </div>
      ))}

      {/* Live Preview */}
      <hr className="my-10" />
      <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
      <div className="border rounded p-6 space-y-6 bg-white">
        {blocks.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className={`${section.padding} ${section.margin}`}
            style={{ backgroundColor: section.bgColor, position: "relative" }}
          >
            {section.children.map((block, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: block.position?.x,
                  top: block.position?.y,
                  width: block.size?.width,
                  height: block.size?.height,
                }}
              >
                {block.type === "heading" && (
                  <div className={block.textColor}>
                    {block.level === 1 && <h1>{block.content}</h1>}
                    {block.level === 2 && <h2>{block.content}</h2>}
                    {block.level === 3 && <h3>{block.content}</h3>}
                  </div>
                )}
                {block.type === "paragraph" && (
                  <p className={block.textColor}>{block.content}</p>
                )}
                {block.type === "image" && (
                  <img
                    src={block.url}
                    alt={block.alt}
                    className="w-full h-auto rounded"
                  />
                )}
                {block.type === "button" && (
                  <a
                    href={block.link}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {block.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
