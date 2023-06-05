import { useEffect, useState,useMemo } from 'react';
import { Table, Container , Row, Col } from 'react-bootstrap';
import Pagination from './Pagination';
import './App.css'



function App() {

  const [userData, setuserData] = useState([]);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUserData();
  }, []);


/** fetch user data from api
 * ==== fetchUserData=======
 *
 */

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=5000');
      const data = await response.json();
      const flattenedData = data.results.map(user => ({
        name: `${user.name.title +'.'} ${user.name.first} ${user.name.last}`,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        city: user.location.city,
        country: user.location.country,
      }));
      setuserData(flattenedData);
    } catch (error) {
      console.error('Error fetching people data:', error);
    }
  };


/** table header sort data with ase? desc
 * ==== handleSort=======
 *
 */

  const handleSort = column => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortOrder('asc');
    }
  };


/** table data search 
 * ==== handleSearch=======
 *
 */

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  
/** search input value reset
 * ==== resetTable=======
 *
 */

  const resetTable = () => {
    setSearchQuery('');
  };


/** user data filter by search query
 * ==== filteredData=======
 *
 */
  const filteredData = userData.filter(person =>
    Object.values(person).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
     
  );


/** user data sorted data 
 * ==== sortedData=======
 *
 */

  const sortedData = sortedColumn
    ? filteredData.sort((a, b) => {
      const valueA = a[sortedColumn].toLowerCase();
      const valueB = b[sortedColumn].toLowerCase();
      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    })
    : filteredData;


/** currentTableData
 * ==== currentTableData=======
 *
 */

  const currentTableData = useMemo(() => {
      const firstPageIndex = (currentPage - 1) * pageSize;
      const lastPageIndex = firstPageIndex + pageSize;
      return sortedData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage,sortOrder,sortedData]);



  return (
    <div className="user-info-section">
      <Container>
        <Row>
          <Col className='shadow rounded'>

                <Col> 

                   <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3 pt-2">
                       <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search" className='form-control' />
                       <button onClick={resetTable}>Reset</button>
                    </div>
                                  
                   
                
                 </Col>
              

                {currentTableData.length >0 ? 
                  <> 
                  <Table striped bordered hover>
                      <thead>
                        <tr className='cursor-pointer'>
                          <th onClick={() => handleSort('name')}>Name</th>
                          <th onClick={() => handleSort('email')}>Email</th>
                          <th onClick={() => handleSort('phone')}>Phone</th>
                          <th onClick={() => handleSort('gender')}>Gender</th>
                          <th onClick={() => handleSort('city')}>City</th>
                          <th onClick={() => handleSort('country')}>Country</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTableData?.map((user, index) => (
                          <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.gender}</td>
                            <td>{user.city}</td>
                            <td>{user.country}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
        
                    <Pagination
                      className="pagination-bar"
                      currentPage={currentPage}
                      totalCount={userData.length}
                      pageSize={pageSize}
                      onPageChange={page => setCurrentPage(page)}
                    />
                  </>
                : "No found data"
                
                }
                
              
          </Col>
        </Row>
      </Container>

    </div>
  )
}

export default App
