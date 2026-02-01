type ButtonProps={
    tekst:string;
    onClick?:()=>void;
    type?:"button"|"submit";
    disabled?:Boolean;
}

export default function Button({tekst,onClick,type="button",disabled=false}:ButtonProps){
    const style="w-full bg-[#7B542F] text-[#FFCF71] py-3 rounded-md font-medium hover:bg-blue-700 transition"
    return(
        <button
        type={type}
        onClick={onClick}
        className={`${style}`}
        >
        {tekst}
        </button>
    )
}