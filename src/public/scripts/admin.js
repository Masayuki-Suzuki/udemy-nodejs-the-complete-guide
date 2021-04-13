'use strict'
NodeList.prototype.forEach =
    NodeList.prototype.forEach || Array.prototype.forEach

document.addEventListener('DOMContentLoaded', () => {
    const deleteProductButtons = document.querySelectorAll('.js-delete-product')

    const deleteProduct = async e => {
        const parentElm = e.target.parentElement
        const csrf = parentElm.querySelector('[name=_csrf]').value
        const id = parentElm.querySelector('[name=id]').value
        const res = await fetch(`/admin/delete-product/${id}`, {
            method: 'delete',
            headers: {
                'csrf-token': csrf
            }
        }).catch(err => {
            console.error(err)
        })
        if (res) {
            const productTableRow = parentElm.closest('tr.border-b')
            productTableRow.parentElement.removeChild(productTableRow)
        }
    }

    if (deleteProductButtons && deleteProductButtons.length > 0) {
        deleteProductButtons.forEach(elm => {
            elm.addEventListener('click', deleteProduct)
        })
    }
})
