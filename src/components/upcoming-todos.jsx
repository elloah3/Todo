export default function UpcomingTodos({ todos }) {
  return (
    <div className="w-1/2 h-full mr-2">
      <div className="bg-gray-300 my-2 p-2 rounded-2xl">
        Upcoming
        <div className="h-5/6 overflow-y-scroll">
          {todos?.map((t) => (
            <div className="my-2 flex justify-between" key={t._id}>
              {t.text}
              <div>{t.deadline}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
