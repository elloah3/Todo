export default function Button({children, ...props}) {
    return <button
        className="bg-dark text-white px-3 py-0.5 rounded hover:bg-gray-700 active:bg-amber-400 cursor-pointer"
    {...props}>{children}</button>
}