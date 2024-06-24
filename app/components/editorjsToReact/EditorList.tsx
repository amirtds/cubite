import React from "react";

interface Props {
  style: string;
  items: string[];
}

const EditorList = ({ style, items }: Props) => {
  if (style === "ordered") {
    return (
      <ol className="list-decimal my-8">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  } else {
    return (
      <ul className="list-disc my-8">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }
};

export default EditorList;
