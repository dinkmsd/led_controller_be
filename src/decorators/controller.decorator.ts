import { UseGuards, applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

export function BaseControllerDecorators({
    tag,
    apiBearerAuth,
    useAuthGuard,
}: {
    tag: string;
    apiBearerAuth?: boolean;
    useAuthGuard?: boolean;
}) {
    const decorators = [
        ApiTags(tag),
        ApiOkResponse({ description: 'Ok' }),
        ApiBadRequestResponse({ description: 'Invalid input' }),
        ApiInternalServerErrorResponse({ description: 'Internal server error' }),
    ];
    if (apiBearerAuth) decorators.push(ApiBearerAuth());
    if (useAuthGuard) decorators.push(UseGuards(new AuthGuard()));
    return applyDecorators(...decorators);
}
