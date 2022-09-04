import React, { useState, useEffect, useRef } from 'react';
import ReactExport from "react-export-excel";
import ReactToPrint from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Table } from 'antd';
import { ComponentToPrint } from './ComponentToPrint';
import pdf from './pdf';

function ExportTo(props) {
	const componentRef = useRef();
	const [columnFiedls, setColumnFields] = useState([]);
	const [data, setData] = useState([]);

	const ExcelFile = ReactExport.ExcelFile;
	const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
	const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

	const dataSet1 = [
		{
			name: "Johson",
			amount: 30000,
			sex: 'M',
			is_married: true
		},
		{
			name: "Monika",
			amount: 355000,
			sex: 'F',
			is_married: false
		},
		{
			name: "John",
			amount: 250000,
			sex: 'M',
			is_married: false
		},
		{
			name: "Josef",
			amount: 450500,
			sex: 'M',
			is_married: true
		}
	];
	
	var dataSet2 = [
		{
			name: "Johnson",
			total: 25,
			remainig: 16
		},
		{
			name: "Josef",
			total: 25,
			remainig: 7
		}
	];

	useEffect(() => {
	  let arrayData = [];
		setColumnFields(props.columns);

	  arrayData = [];
	  props.dataSource.forEach((item, index) => {
	  	let arrayTempObject = {};
	  	Object.keys(item).map(data => {
	  		if(data !== "key") {
	  			arrayTempObject[data] = item[data];
	  		}
	  	})
	  	arrayData.push(arrayTempObject);
	  })
	  setData(arrayData);
	}, [props]);

	const onPdfDownload = () => {

		// const input = document.getElementsByClassName('table-wrapper');
		// const input =document.getElementById('download-content');
		const input = document.getElementById('table-wapper');
		html2canvas(input)
			.then((canvas) => {
				let imgWidth = 208;
				let imgHeight = canvas.height * imgWidth / canvas.width;

				const imgData = canvas.toDataURL('image/png');
				const pdf = new jsPDF('p', 'mm', 'a4');
				pdf.setFontSize(8)
				pdf.addImage(imgData, 'PNG', 5, 5, imgWidth - 10, imgHeight -10);
				pdf.save(props.filename);
			});

	}

 	return(
		<div className="export-button">
			<ExcelFile 
				filename={props.filename}
				element={<a href="#" className="mr-2 content-tool-bar"><i className='fa fa-file-excel-o excel-icon'></i>EXCEL</a>}>
                <ExcelSheet data={data} name="sheet1">
					{columnFiedls.length > 0 ? (
						columnFiedls.map((item, index) => {
							 return <ExcelColumn label={item.title} key={index} value={item.key}/>
						})
					) : null}
                </ExcelSheet>
            </ExcelFile>
			<div style={{display: "none"}}>
				<ComponentToPrint column={[...columnFiedls]} data={[...data]} ref={componentRef} />
			</div>
            <a href="#" className="mr-2 content-tool-bar" onClick={onPdfDownload}><i className="fa fa-file-pdf-o pdf-icon"></i>PDF</a>
			<ReactToPrint
				trigger={() => {
					return <a href="#" className="mr-2 content-tool-bar"><i className="fa fa-print print-icon"></i>PRINT</a>;
				}}
				content={() => componentRef.current}
			/>
			<div style={{display: "none"}}>
				<div id='download-content'>
					<Table 
								dataSource={data} 
								columns={columnFiedls} 
								pagination={false}
							/>
				</div>	
			</div>
		</div>
	)
}

export default ExportTo;