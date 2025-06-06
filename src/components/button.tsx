export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>){
    return(
        <button type="submit" className="rounded-lg p-2 w-full mt-4 hover:cursor-pointer" {...props}>
            {props.children}
        </button>
    )
}