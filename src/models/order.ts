import { model, Document } from 'mongoose'
import { OrdersModel } from 'src/types/models'
import OrderSchema from '../Schemas/Order'

export default model<OrdersModel & Document>('Order', OrderSchema)
