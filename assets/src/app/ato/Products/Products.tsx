import * as React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import {
  Page,
  Gallery,
  GalleryItem,
  TextContent,
  Text,
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardHeaderMain,
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core';
import { NavLink } from 'react-router-dom';
import { GetProductParamsFromUrl } from '@app/AppLayout/ProductSelector'
import { ProductInfo } from '@app/ato/Products/Static.tsx'

import * as Api from '@app/lib/api'
import redhatLogo from '@app/assets/images/red-hat-logo-a.png';

const ProductGalleryItem: React.FunctionComponent<any> = (props) => {
    var productId = props['product']['key'];
    var logo = (ProductInfo[productId] && ProductInfo[productId].image) || redhatLogo;
    return (
        <GalleryItem>
            <NavLink exact={true} aria-label={productId} to={"/ato/products/" + productId + props['params']}>
                <Card isHoverable>
                    <CardHeader>
			<CardHeaderMain>
                            <img src={logo} alt={"logo of " + productId} />
                        </CardHeaderMain>
                    </CardHeader>
                    <CardTitle>{props['product']['name']}</CardTitle>
                    { props.product.satisfies !== undefined ?
                        <CardFooter><Text component="small">{props['product']['satisfies'].length} controls defined</Text></CardFooter>
                        : "" }
                </Card>
            </NavLink>
        </GalleryItem>
    )
};

class Products extends React.Component {
    render(){
        const params = GetProductParamsFromUrl();
        return (
            <Page>
                <PageSection variant={PageSectionVariants.light}>
                    <TextContent>
                        <Text component="h1">Product Documents</Text>
                        <Text component="p">Product-specific security documentation.</Text>
                    </TextContent>
                </PageSection>

                <PageSection>
                    <Gallery hasGutter>
                        { (this.state['isLoading'] ? <Spinner/> : this.state['products'].map((function(object, i){
                            return (<ProductGalleryItem key={object['key']} product={object} params={params} />);
                        })))}
                    </Gallery>
                </PageSection>
            </Page>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            products: []
        };
        Api.components()
            .then(data => this.setState({products: data, isLoading: false}));
    }
}

export { Products };

