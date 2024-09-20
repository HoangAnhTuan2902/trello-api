import express from 'express'

import { workSpaceValidation } from '~/validations/workSpaceValidation'
import { workSpaceController } from '~/controllers/workSpaceController'

const Router = express.Router()

Router.route('/').post(workSpaceValidation.createNew, workSpaceController.createNew)
Router.route('/u/:userId').get(workSpaceController.getAll)

Router.route('/:id').get(workSpaceController.getDetails)
// .delete(workSpaceValidation.deleteWorkSpace, workSpaceController.deleteWorkSpace)

export const workSpaceRoute = Router
