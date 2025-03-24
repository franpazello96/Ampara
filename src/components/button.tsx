export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>){
    return(
        <button type="submit" className="bg-zinc-500 dark:bg-zinc-700 text-zinc-100
        dark:text-zinc-100 rounded-lg p-2 w-full mt-4 hover:cursor-pointer hover:bg-zinc-400 
        dark:hover:bg-zinc-600" {...props}>
            {props.children}
        </button>
    )
}