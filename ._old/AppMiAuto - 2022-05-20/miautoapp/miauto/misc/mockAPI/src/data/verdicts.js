import DefaultMsgs from './messages/errors.msg.json' assert { type: "json" };


const context = new URL(import.meta.url).searchParams.get('context');
const InContextMsgs = await import( './messages/${context}.json' );

const ErrsMsgs = {
    ...DefaultMsgs,
    ...InContextMsgs
};

const Verdicts = {
    'CAN_T_READ': {
        status: 500,
        type: 'json',
        outcome: { "error": ErrsMsgs.CAN_T_READ }
    },
    'CAN_T_RESET': {
        status: 500,
        type: 'json',
        outcome: { "error": ErrsMsgs.CAN_T_RESET }
    },
    'CAN_T_SAVE': {
        status: 500,
        type: 'json',
        outcome: { "error": ErrsMsgs.CAN_T_SAVE }
    },
    'CLASS__INIT': {
        status: 500,
        type: 'json',
        outcome: { "error": ErrsMsgs.CLASS__INIT }
    },
    'NO_DATA': {
        status: 412,
        type: 'json',
        outcome: { "error": ErrsMsgs.NO_DATA }
    },
    'SEARCH__NOT_FOUND': {
        status: 404,
        type: 'json',
        outcome: { "error": ErrsMsgs.SEARCH__NOT_FOUND }
    },
};

export default Verdicts;
