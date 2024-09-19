/* *
    Verdicts could store an additional function as one of its members that does what needs to be done on when faced with the corresponding error or handles that function to the server so that the server tweaks it and runs it.
*/
import ErrsMsgs from './messages/errors.msg.json' assert { type: "json" };


type t_resType = 'json' | 'send';

interface t_Verdict {
    status: number;
    type: t_resType;
    outcome: {
        error: string;
    };
};

interface t_Verdicts {
    [ key: string ]: t_Verdict
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
    'FILTER__NO_MATCH': {
        status: 404,
        type: 'json',
        outcome: { "error": ErrsMsgs['FILTER__NO_MATCH'] }
    },
    'NO_DATA': {
        status: 412,
        type: 'json',
        outcome: { "error": ErrsMsgs['NO_DATA__NO_PRODUCTS'] }
    },
};

export type { t_Verdicts, t_Verdict, t_resType };
export default Verdicts;
