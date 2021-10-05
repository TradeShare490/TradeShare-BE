import { expect } from "chai";
import DefaultService from "../services/default.service";

describe('Default service can', () => {
    let service:DefaultService;

    it('be setup', () => {
        service = new DefaultService()
    })

    it('say hello', () => {
        const res = service.hello() 
        expect(res, 'to include hello').to.include('Hello')
    }) 

    it('say testing', () => {
        const res = service.apiCheck() 
        expect(res, 'to include running').to.include('RUNNING')
    })

    it('say not found', () => {
        const res = service.notFound() 
        expect(res, 'to include NOT-FOUND').to.include('NOT-FOUND')
    })

})