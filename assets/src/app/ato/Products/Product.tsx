import * as React from 'react';
import {
    Alert,
    ApplicationLauncher, ApplicationLauncherItem,
    DropdownPosition,
    Page, PageSection, PageSectionVariants,
    TextContent,
    Text,
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core';
import { EditAltIcon } from '@patternfly/react-icons'

import * as Api from '@app/lib/api'
import { Markdown } from '@app/lib/markdown';
import { ProductIdOverride, ProductInfo } from '@app/ato/Products/Static.tsx'
import { RTMDataList } from '@app/ato/Products/DataList.tsx'
import { Products } from '@app/ato/Products/Products'
import { Certification } from '@app/lib/opencontrol'
import { CompletionCharts } from '@app/ato/Charts/CompletionCharts'

interface ProposeChangeProps {
    link: string;
}

interface ProposeChangeState {
    isOpen: boolean;
}

class ProposeChange extends React.PureComponent<ProposeChangeProps, ProposeChangeState> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.onSelect = this.onSelect.bind(this);
        this.onToggle = this.onToggle.bind(this);

    }

    onSelect(event) {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
    onToggle(isOpen) {
        this.setState({
            isOpen
        });
    };

    render() {
        const { isOpen } = this.state;
        const appLauncherItems = [
            <ApplicationLauncherItem key="application_1a" href={this.props.link} isExternal={true}>
                Propose changes to this page
            </ApplicationLauncherItem>,
        ];
        return (
            <div style={{float: 'right'}}>
                <ApplicationLauncher onSelect={this.onSelect} onToggle={this.onToggle}
                                     isOpen={isOpen} items={appLauncherItems}
                                     position={DropdownPosition.right} toggleIcon={<EditAltIcon/>} />
            </div>
        );
    }
}

interface ProductState {
    isLoading: boolean;
    productId: string;
    product: any;
    certifications: Certification[];
    activeTabKey: string;
};

class Product extends React.PureComponent<any, ProductState> {
    static texts(productId: string) {
        return ProductInfo[productId] ? ProductInfo[productId].texts : {};
    }

    texts() {
        return Product.texts(this.state.productId);
    }

    renderMarkdown(textId) {
        const texts = this.texts();
        const Element = texts[textId] as any;
        if (Element) {
            return <React.Fragment>
                <Markdown><Element/></Markdown>
            </React.Fragment>
        }
        return '';
    }

    showingMarkdown(): boolean {
        return this.state.activeTabKey != 'NIST-800-53' && this.state.activeTabKey != 'nist-800-53' && !this.showingCharts()
    }

    showingCharts(): boolean {
        return this.state.activeTabKey == 'Charts'
    }

    urlForEditing(): string {
        if (this.showingMarkdown()) {
            return "https://github.com/RedHatGov/ocdb/edit/master/assets/src/app/assets/markdown/products/" + this.state.productId + "/" + this.state.activeTabKey + ".md"
        } else {
            return "https://github.com/ComplianceAsCode/redhat/tree/master/" + this.state.productId
        }
    }

    renderTabs(){
        if (this.showingMarkdown()) {
            const renderMarkdown = this.renderMarkdown;
            return renderMarkdown(this.state.activeTabKey);
        } else if (this.state.product != null && this.state.product.controls.length == 0) {
            return (
                <Text>NIST-800-53 responses for {this.state.product.name} are not available in a form of open controls and/or oscal.</Text>
            )
        } else if (this.showingCharts()) {
            return this.renderCharts()
        } else {
            if (this.state.isLoading) {
                return <Spinner/>
            } else {
                return (
                    <React.Fragment>
                        <TextContent>
                            { this.state.product['errors'].length == 0 ?
                              '' :
                              <React.Fragment>
                                  <Text component="h2">OpenControls Developer Information</Text>
                                  <Alert  variant="warning" title="Metadata Warnings">
                                      {this.state.product['errors'].map((function(error, i) {
                                           return <Text component="p" key={i}>{error}</Text>;
                                       }))}
                                  </Alert>
                              </React.Fragment>
                            }
                            <Text component="h2">Requirements Traceability Matrix</Text>
                        </TextContent>
                        <RTMDataList content={this.state.product['controls']} certifications={this.state.certifications} />
                    </React.Fragment>
                )
            }
        }
    }

    render(){
        if (this.state.productId == 'select') {
            return <Products/>
        }

        return (
            <Page>
                <PageSection variant={PageSectionVariants.light}>
                    <ProposeChange link={this.urlForEditing()} />
                    { this.state.isLoading ?
                      <Spinner/> :
                      <React.Fragment>
                          <TextContent>
                              <Text component="h1">{this.state.product['name']}</Text>
                          </TextContent>
                      </React.Fragment>
                    }

                    { this.renderTabs() }

                </PageSection>
            </Page>
        );
    }

    renderCharts() {
        return (
            <CompletionCharts productId={this.state.productId} />
        )
    }

    static getId(props) {
        return ProductIdOverride(props['computedMatch'].params.productId);
    }
    static getDerivedStateFromProps(props, state) {
        const productId = Product.getId(props);
        const activeTabKey = props['computedMatch'].params.tabId;
        if (state.productId != productId) {
            return {
                isLoading: true,
                productId: productId,
                product: null,
                activeTabKey: activeTabKey,
            }
        }
        if (state.activeTabKey != activeTabKey) {
            return {activeTabKey};
        }
        return null;
    }
    componentDidUpdate() {
        if (this.state.isLoading && this.state.productId != 'select') {
            Api.componentControls(this.state.productId)
               .then(data => {
                   this.setState({product: data, isLoading: false})
               })
        }
    }

    constructor(props) {
        super(props);
        const productId = Product.getId(props);

        this.state = {
            isLoading: true,
            productId: productId,
            product: null,
            certifications: [],
            activeTabKey: props['computedMatch'].params.tabId,
        };
        this.renderMarkdown = this.renderMarkdown.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        Api.certifications().then(data => this.setState({certifications: data}))
        this.componentDidUpdate();
    }
}

export { Product };
