//Reducer => A function that takes in the old state, and an action => new state...

const contextReducer = (state, action)=> {
 let transactions;

 switch(action.type) {
    case 'DELETE-TRANSACTION':
        transactions = state.filter((t)=> t.id !== action.payload)

        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        return transactions;

        case 'ADD-TRANSACTION':
            transactions = [action.payload, ...state]
            localStorage.setItem('transactions', JSON.stringify(transactions));
            return transactions;

            case 'SET_TRANSACTIONS':
                return action.payload;

            default:
            return transactions;;
 }
}

export default contextReducer;