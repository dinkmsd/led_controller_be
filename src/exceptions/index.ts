import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import EXCEPTION_KEYS from './business-exception-keys';

const LOGIC_EXCEPTION_CODE = 420;

export class BusinessExceptions {
    static internalServerError(message?: string) {
        let msg = 'Internal server error';
        if (message) msg += ` ${message}`;
        const exception = new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        Logger.error(exception);
        return exception;
    }

    static unauthorized() {
        return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    static invalidOTPCode() {
        return new HttpException(
            'Otp is incorrect or expired',
            HttpStatus.UNAUTHORIZED,
        );
    }

    static unprocessableEntity() {
        return new HttpException(
            'Unprocessable Entity',
            HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }

    static inputInvalid(msg?: string) {
        return new HttpException(msg || 'Input invalid', HttpStatus.BAD_REQUEST);
    }

    static limitActiveGiftPeriod() {
        return new HttpException(
            { key: EXCEPTION_KEYS.LIMIT_ACTIVE_GIFT_PERIOD },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static invalidGiftPeriodEndTime() {
        return new HttpException(
            { key: EXCEPTION_KEYS.INVALID_GIFT_PERIOD_ENDTIME },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static requireContainGift() {
        return new HttpException(
            { key: EXCEPTION_KEYS.REQUIRE_GIFT },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static unAllowedLoginEmail() {
        return new HttpException(
            { key: EXCEPTION_KEYS.UN_ALLOWED_LOGIN_EMAIL },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static giftPeriodIntersectionTime() {
        return new HttpException(
            { key: EXCEPTION_KEYS.GIFT_PERIOD_INTERSECTION_TIME },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static exchangeGiftInvalidKudosPoint() {
        return new HttpException(
            { key: EXCEPTION_KEYS.EXCHANGE_REQUEST_INVALID_POINT },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static exchangeGiftInvalidQuantity() {
        return new HttpException(
            { key: EXCEPTION_KEYS.EXCHANGE_REQUEST_INVALID_QUANTITY },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static absenceConflictRequest(data: any) {
        return new HttpException(
            { key: EXCEPTION_KEYS.ABSENCE_CONFLICT_REQUEST, data },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static kudosInvalidSelfGive() {
        return new HttpException(
            { key: EXCEPTION_KEYS.KUDOS_SELF_GIVE },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static kudosInvalidDuplicatedGive() {
        return new HttpException(
            { key: EXCEPTION_KEYS.KUDOS_DUPLICATED_GIVE },
            LOGIC_EXCEPTION_CODE,
        );
    }

    static kudosLimitKudosPerMonth() {
        return new HttpException(
            { key: EXCEPTION_KEYS.KUDOS_LIMIT_KUDOS_PER_MONTH },
            LOGIC_EXCEPTION_CODE,
        );
    }
}
