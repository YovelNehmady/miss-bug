const { useState, useEffect } = React
import { bugService } from '../services/bug.service.js'


export function BugFilter({ setFilterBy }) {
    const [filter, setFilter] = useState(bugService.getEmptyFilter())

    useEffect(() => {
        setFilterBy(filter)
    }, [filter])

    function handleChange({ target }) {
        let { value, name: field } = target
        setFilter((prevFilter) => {
            return { ...prevFilter, [field]: value }
        })
    }

    return <article className="bug-filter">
        <form>
            <div className="fa-solid search"></div>
            <input type="text"
                id="txt"
                name="txt"
                className="txt"
                placeholder="Search by title & description..."
                value={filter.txt}
                onChange={handleChange} />

            <button onClick={(ev) => {
                setFilter(bugService.getEmptyFilter())
                ev.preventDefault()
            }} >Search</button>

        </form>

    </article>
}