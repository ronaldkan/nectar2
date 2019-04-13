import React, { Component } from 'react'
import { Button, Header, Form } from 'semantic-ui-react'

class Deploy extends Component {


    componentDidMount() {
    }


    handleSubmit = () => {
    }

    render() {
        const { image, handleChange } = this.props;

        return (
            <div>
                <Header size='large'>Deploy</Header>
                <Form onSubmit={() => this.handleSubmit()}>
                    <Form.Field>
                        <label>Image</label>
                        <Form.Input name='image' value={image} placeholder='Image name...' onChange={handleChange} />
                    </Form.Field>
                    <Button type='submit'>Deploy</Button>
                </Form>
            </div>
        )
    }
}

export default Deploy;