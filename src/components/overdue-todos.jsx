export default function Overdue({ todos }) {
  return (
    <div className="w-1/2 my-2">
      <div className="bg-gray-300 p-2 rounded-2xl h-full">
        Overdue
        <div className=" h-5/6 overflow-y-scroll rounded-2xl">
          {todos?.map((t) => (
            <div className="my-2 flex justify-between" key={t._id}>
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
