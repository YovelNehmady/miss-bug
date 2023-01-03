const { useState, useEffect, useRef } = React
import { bugService } from '../services/bug.service.js'


export function BugFilter({ setFilterBy }) {
    const [filter, setFilter] = useState(bugService.getEmptyFilter())
    const elDescRef = useRef(null)


    useEffect(() => {
        setFilterBy(filter)
    }, [filter])

    function handleChange({ target }) {
        let { type, value, name: field } = target
        if (type === 'checkbox') {
            value = elDescRef.current.checked ? 1 : -1
        }
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

            <select className="label" name="label" id="label" value={filter.label} onChange={handleChange} >
                <option value="">Select Label</option>
                <option value="critical">Critical</option>
                <option value="need-CR">Need CR</option>
                <option value="dev-branch">Dev branch</option>
            </select>


            <div className="filter-sort-container">

                <h6>Sort By:</h6>
                <select className="sortBy" name="sortBy" id="sortBy" value={filter.sortBy} onChange={handleChange} >
                    <option value="">Select Sorting</option>
                    <option value="createdAt">By Date</option>
                    <option value="severity">By Severity</option>
                </select>

                <label>
                    Descending
                    <input ref={elDescRef} className="desc" name="desc" id="desc" value={filter.desc} type="checkbox" onChange={handleChange} />
                </label>

            </div>

        </form>

    </article>
}