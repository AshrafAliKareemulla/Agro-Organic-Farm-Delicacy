export const shortenText=(text,n)=>{
    if(text.length>n){
        const shortenedText=text.substring(0,n).concat("...");
        return shortenedText;
    }
    return text;
}

//!validate Email

export const validateEmail=(email)=>{
    return email.match( /^[A-Z0-9+_.-]+@[A-Z0-9.-]+\.[A-Z0-9.-]+$/i)
}