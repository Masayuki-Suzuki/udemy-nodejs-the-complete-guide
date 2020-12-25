export default (val: number): string => {
    const formatter = new Intl.NumberFormat('us-EN', {
        style: 'currency',
        currency: 'USD'
    })

    return formatter.format(val)
}
