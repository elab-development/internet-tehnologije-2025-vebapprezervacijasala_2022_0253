type ButtonProps={
    tekst:string;
    onClick?:()=>void;
    type?:"button"|"submit";
    disabled?:Boolean;
}

export default function Button({tekst,onClick,type="button",disabled=false}:ButtonProps){
    const style=" bg-[#B6771D] text-[#7B542F] py-3 rounded-md font-medium hover:bg-[#FFCF71] transition px-4"
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