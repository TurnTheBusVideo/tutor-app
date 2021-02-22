import { getCloudData } from '../utils/dataUtil';
import * as ReactBootstrap from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import SpinnerText from '../components/shared/SpinnerText';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { render } from '@testing-library/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const HistoryPage = () =>
{
     
  const [formLoading, setFormLoading] = useState(true);
  const [showFormError, setShowFormError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [historyDataValue, setHistoryData] = useState([])
   
  var response;

   
   useEffect(() => {
    getCloudData({
        pre: () => setFormLoading(true),
        tableName: 'UploadVideo',
        validator: (response) => response?.result?.Count >= 0,
        victory: (UploadVideo, textStatus, jqXHR) => {
             response = UploadVideo.Items;
             setHistoryData(response);
             setFormLoading(false);
             setShowForm(true);
         
        },
         defeat: () => {
               setFormLoading(false);
               setShowFormError(true);
          }
    });
}, [] 
)
const defaultSorted = [{
  dataField: 'subject',
  order: 'desc'
}];

const options = {
  paginationSize: 5,
  pageStartIndex: 0,
  firstPageText: 'First page',
  prePageText: 'Previous',
  nextPageText: 'Next',
  lastPageText: 'Last Page',
  showTotal: true,
  alwaysShowAllBtns: true,

  sizePerPageList: [
    {text: 'show 5', value: 5},
    {text: 'show 10', value: 10},
    {text: 'show 15', value: 15},
  ],
  onPageChange: function (page, sizePerPage)
  {
    console.log('page',page);
    console.log('sizePerPage',sizePerPage);
  },
  onSizePerPageChange: function (page, sizePerPage)
  {
    console.log('page', page);
    console.log('sizePerPage', sizePerPage);
  }
  
};
 const columns = [
        {dataField: 'subject', text: 'Subject'},
        {dataField: 'videoTitle', text: 'Video Title'},
        {dataField: 'bookName', text: 'Book Name'},
        {dataField: 'chapterName', text: 'Chapter Name'},
        {dataField: 'chapterNumber', text: 'Chapter Number'},
        {dataField: 'chapterPart', text: 'Chapter Part'},
        {dataField: 'videoDescription', text: 'Video Description'},
        {dataField: 'tutorName', text: 'Tutor Name'},
        {dataField: 'fileName', text: 'File Name'}
    
 ];
return (
  
  <div className="App">
    
     <h3> Video Upload History </h3>
    
     <SpinnerText spinning={formLoading} label=" loading history data" />
     {!formLoading && !showFormError && showForm && (
               <BootstrapTable striped  keyField='uploadID' 
                   columns={ columns } 
                   data={historyDataValue} 
                   defaultSorted={defaultSorted}
                   pagination={paginationFactory(options)} 
                   id="historyTable"  />
                 
      )}

  </div>
  
)

}
export default HistoryPage;

