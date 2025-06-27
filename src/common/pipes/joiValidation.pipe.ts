import {
    PipeTransform,
    Injectable,
    BadRequestException,
} from "@nestjs/common";
import { ObjectSchema } from "joi";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: Record<string, any>, ) {
        const { error } = this.schema.validate(value);

        if (error) {
            throw new BadRequestException({
                message: "Validation failed",
                details: error.message.replace(/("|\[|\d])/g, ""),
                error: true
            });
        }

        return value;
    }
}