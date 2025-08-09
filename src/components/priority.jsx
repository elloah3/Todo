import { Fragment } from "react";

export default function PriorityTodos({ todos }) {
  return (
    <div>
      <div>Priority</div>
      <div
        className="inline-grid todo-list-grid"
        style={{
          gridTemplateColumns: "auto auto",
        }}
      >
        {todos?.map((t) => (
          <Fragment key={t._id}>
            <div className="bg-amber-100">{t.text}</div>
            <div>{t.deadline}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
