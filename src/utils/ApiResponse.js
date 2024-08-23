class ApiResponse{
    constructor(
        status,
        data,
        message="Success!!"
    ){
        this.status=status<400;
        this.data=data;
        this.message=message
    }
}
export {ApiResponse};