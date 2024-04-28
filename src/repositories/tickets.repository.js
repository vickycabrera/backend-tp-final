const TicketModel = require("../models/ticket.model.js")
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js")

class TicketRepository {
    async createTicket(userWithCartId, products) {
        const ticket = new TicketModel({
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: calcularTotal(products),
            purchaser: userWithCartId
        });
        return await ticket.save();
    }
}

module.exports = TicketRepository;