export default function UpcomingTodos({ todos }) {
  return (
    <div>
      <div className="bg-gray-300 my-2 p-2 rounded-2xl">
        Upcoming
        <div>
          {todos?.map((t) => (
            <div className="my-2" key={t._id}>
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
