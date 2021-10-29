import React, {useEffect, useState} from 'react';
import './App.css';
import {Formik, Field, Form, FieldArray} from "formik";


function App() {

    const [data, setData] = useState({});

    const MyCheckbox = ({field, form, label, ...rest}) => {
        const {name, value: formikValue} = field;
        const {setFieldValue} = form;

        const handleChange = event => {
            const values = formikValue || [];
            const isChecked = event.target.checked;
            const category = rest.value;
            if (isChecked){
                for (let item of data[category]){
                    const index = values.indexOf(item.id);
                    if (index === -1) {
                        values.push(item.id);
                    }
                }
            } else{
                for (let item of data[category]){
                    const index = values.indexOf(item.id);
                    if (index !== -1) {
                        values.splice(index, 1);
                    }
                }
            }

            setFieldValue(name, values);
        };

        return (
            <label>
                <input
                    type="checkbox"
                    onChange={handleChange}
                    {...rest}
                />
                <span>{label}</span>
            </label>
        );
    };

    const PercentageRate = ({field, form, label, ...rest}) => {
        const {name, value: formikValue} = field;
        const {setFieldValue} = form;

        const handleChange = event => {

            let value = +event.target.value/100;

            setFieldValue(name, value);
        }

        return (
                <input
                    type="number"
                    onChange={handleChange}
                    {...rest}
                />
        );
    }

    // SET INITIAL VALUES OF FORM FIELDS
    const initialValues = {
        name: '',
        rate: 0,
        applied_to: '',
        // search: '',
        applicable_items: []
    };

    // FETCH API DATA
    const fetchData = () => {
        fetch('data.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((result) => {
            return result.json()
        }).then((data) => {
            // console.log(data)
            formatData(data);
        }).catch((error) => {
            console.error(error);
        })
    };

    // CALL API ON COMPONENT DID MOUNT
    useEffect(() => {
        fetchData();
    }, []);

    const formatData = (allData) => {
        let dataObject = {};

        for (let i = 0; i < allData.length; i++) {
            if (allData[i]['category']) {
                console.log(allData[i]);

                if (dataObject.hasOwnProperty(allData[i]['category']['name'])) {
                    dataObject[allData[i]['category']['name']].push(allData[i]);
                } else {
                    console.log('first time');
                    dataObject[allData[i]['category']['name']] = [];
                    dataObject[allData[i]['category']['name']].push(allData[i]);
                }


            } else {
                if (dataObject.hasOwnProperty('none')) {
                    dataObject['none'].push(allData[i]);
                } else {
                    console.log('first time');
                    dataObject['none'] = [];
                    dataObject['none'].push(allData[i]);
                }
            }
        }
        console.log(dataObject);
        setData(dataObject);
    };

    const MainForm = props => {
        return(
        <Formik initialValues={initialValues}
                onSubmit={(values, actions) => {
                    console.log(values, actions)
                }}>
            {
                props => {
                    const { values } = props;
                    return (
                    <Form>
                        <div>
                        REQUIRED OUTPUT: {JSON.stringify(values)}
                        </div>

                        <div className="add-header">
                            <div>Add Tax</div>
                        </div>
                        {/* Add Tax Resource */}
                        <div className="wrapper form-container">
                            <div className="wrapper form-group-container">
                                <div className="form-group">
                                    <Field type="text" name="name" id="name" placeholder="Name"/>
                                </div>
                                <div className="rate-form">
                                    <Field type="number" name="rate" id="rate" placeholder="Rate" component={PercentageRate} />
                                    <div className="rate-label">%</div>
                                </div>
                            </div>

                            <div className="wrapper">
                                <div className="">
                                    <Field type="radio" className="radio-custom" id="all" name="applied_to"
                                           value="all"/>
                                    <label className="applied_to radio-custom-label" htmlFor="all">Apply to all
                                        items in collection</label>
                                </div>
                            </div>
                            <div className="wrapper">
                                <div className="">
                                    <Field type="radio" className="radio-custom" id="some" name="applied_to"
                                           value="some"/>
                                    <label className="applied_to radio-custom-label" htmlFor="some">Apply to
                                        specific items</label>
                                </div>
                            </div>

                        </div>

                        {/* Search Text */}
                        <div className="wrapper">
                            <div className="search-form">
                                <input type="text" name="search" id="rate" placeholder="Search Items"/>
                                <div className="search-label">&#x2315;</div>
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="wrapper checkbox-container">
                            {
                                Object.keys(data).length !== 0 ?

                                    Object.keys(data).map((key) => {
                                        return (
                                            <div key={key} style={{marginBottom: '15px'}}>
                                                <div className="category-head">
                                                    <Field component={MyCheckbox} name="applicable_items" value={key}
                                                           label={key !== 'none' ? key : ''}/>
                                                </div>
                                                <FieldArray
                                                    name="applicable_items"
                                                    render={arrayHelpers => (
                                                        <div>
                                                            {
                                                                data[key].map((item) => {
                                                                    return (
                                                                        <ul key={item.id}>
                                                                            <li className="items">
                                                                                <input
                                                                                    type="checkbox" name="applicable_items"
                                                                                    id={item.id} value={item.id}
                                                                                    checked={values.applicable_items.includes(item.id)}
                                                                                    onChange={e => {
                                                                                        if (e.target.checked) {
                                                                                            arrayHelpers.push(item.id);
                                                                                        } else {
                                                                                            const idx = values.applicable_items.indexOf(item.id);
                                                                                            arrayHelpers.remove(idx);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <label
                                                                                    htmlFor={item.id}>{item.name}</label>
                                                                            </li>
                                                                        </ul>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )}
                                                />
                                            </div>)
                                    })

                                    : ''
                            }
                        </div>
                        <div className="btn-div">
                            <button className="btn">Apply tax to {values.applicable_items.length} item(s)</button>
                        </div>

                    </Form>
                    )
                }
            }
        </Formik>
        );
    }

    return (
        <div className="App">
            <header className="">
                <nav>
                    <div className="container">Tax Resources</div>
                </nav>
            </header>
            <main className="container">
                <div className="content-wrapper">
                <MainForm/>
                </div>
            </main>
        </div>
    );
}

export default App;
