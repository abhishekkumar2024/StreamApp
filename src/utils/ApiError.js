class ApiErrors extends Error{
    constructor(
        statuscode,
        message="Something went Wrong",
        Errors=[],
        stack=""
    ){
        super(message)
        this.statuscode=statuscode;
        this.message=message;
        this.Errors=Errors,
        this.data=null,
        this.success=false;
        if(stack){
            this.stack=stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}
export {ApiErrors}