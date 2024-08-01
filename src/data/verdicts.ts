import ErrsMsgs from './messages/errors.msg.json' assert { type: "json" };

interface t_Verdicts {
    [ key: string ]: {
        status: number;
        type: string;
        outcome: {
            error: string;
        };
    };
};

const Verdicts: t_Verdicts = {
    'CAN_T_READ': {
        status: 500,
        type: 'json',
        outcome: { "error": ErrsMsgs['CAN_T_READ'] }
    },
    'CAN_T_RESET': {
        status: 500,
        type: 'json',
        outcome: { "error": ErrsMsgs['CAN_T_RESET'] }
    },
    'CAN_T_SAVE': {
        status: 500,
        type: 'json',
        outcome: { "error": ErrsMsgs['CAN_T_SAVE'] }
    },
    'CLASS__INIT': {
        status: 500,
        type: 'json',
        outcome: { "error": ErrsMsgs['CLASS__INIT'] }
    },
    'SEARCH__NOT_FOUND': {
        status: 404,
        type: 'json',
        outcome: { "error": ErrsMsgs['SEARCH__PRODUCT_NOT_FOUND'] }
    },
    'NO_DATA': {
        status: 412,
        type: 'json',
        outcome: { "error": ErrsMsgs['NO_DATA__NO_PRODUCTS'] }
    },
};

export type { t_Verdicts };
export default Verdicts;
