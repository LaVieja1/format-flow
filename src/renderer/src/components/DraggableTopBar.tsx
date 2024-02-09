export const DraggableTopBar = () => {
  return (
    <header className="absolute inset-0 h-8 bg-transparent border-b-2 border-b-red-500">
      <nav className="flex items-center justify-end align-middle h-full">
        <button className="bg-transparent px-5 h-full hover:bg-slate-700/75">-</button>
        <button className="bg-transparent px-5 h-full hover:bg-slate-700/75">+</button>
        <button className="bg-transparent px-5 h-full hover:bg-red-500/75">X</button>
      </nav>
    </header>
  )
}
