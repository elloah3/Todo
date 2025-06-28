export default function Overdue({ todos, setD }) {
  function retrieveDeadline(ddd) {
    let dateObj = new Date(ddd + "T00:00:00");
    setD(dateObj);
  }

  return (
    <div className="w-1/2 my-2">
      <div className="bg-gray-300 p-2 rounded-2xl h-full">
        Overdue
        <div className=" h-5/6 overflow-y-scroll rounded-2xl">
          {todos?.map((t) => (
            <button
              className="my-2 flex justify-between cursor-pointer"
              key={t._id}
              onClick={() => retrieveDeadline(t.deadline)}
            >
              {t.text}
              <div className="ml-2 text-gray-500 ">{t.deadline}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
