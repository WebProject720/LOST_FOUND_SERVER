export class ApiResponse{
    constructor(statusCode,data,msg="Request Fullfilled"){
        this.statusCode=statusCode
        this.data=data
        this.message=msg
        this.value=statusCode<400
    }
}