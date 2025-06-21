export default function UpcomingTodos({ todos, setD }) {
  function retrieveDeadline(ddd) {
    let dateObj = new Date(ddd + "T00:00:00");
    setD(dateObj);
  }

  return (
    <div className="w-1/2 h-full mr-2">
      <div className="bg-gray-300 my-2 p-2 rounded-2xl">
        Upcoming
        <div className="h-5/6 overflow-y-scroll">
          {todos?.map((t) => (
            <button
              className="my-2 flex justify-between"
              key={t._id}
              onClick={() => retrieveDeadline(t.deadline)}
            >
              {t.text}
              <div>{t.deadline}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
