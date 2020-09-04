import * as React from 'react';
import {
    Flex, FlexItem,
    Page, PageSection, PageSectionVariants,
    Text, TextContent,
} from '@patternfly/react-core';
import { FileWordIcon } from '@patternfly/react-icons'
import { IRow, Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table'
import * as Api from '@app/lib/api'

interface FedRAMPsState {
    rows: IRow[];
}
class ComponentFedRAMPTemplates extends React.Component<any, FedRAMPsState> {
    columns = ['Product', 'FedRAMP Low', 'FedRAMP Moderate', 'FedRAMP High'];
    constructor(props) {
        super(props);
        Api.components()
           .then(data => this.buildRows(data));
        this.state = {
            rows: [],
        }
    }
    buildRows(products) {
        this.setState({rows: products.filter((p) => {
                return p.satisfies
            }).map(function(p, idx) {
            return [
                (<Text component="p" key={idx}>{p.name}</Text>),
                /* (<TextContent key={idx+'t'}>
                <center>
                    <Text component="a" href={'/api/v1/components/' + p.key + '/fedramp/Tailored'}><FileWordIcon/> .docx</Text>
                </center>
                </TextContent>), */
                (<TextContent key={idx+'l'}>
                    <Text component="a" href={'/api/v1/components/' + p.key + '/fedramp/Low'}><FileWordIcon/> .docx</Text>
                </TextContent>),
                (<TextContent key={idx+'m'}>
                    <Text component="a" href={'/api/v1/components/' + p.key + '/fedramp/Moderate'}><FileWordIcon/> .docx</Text>
                </TextContent>),
                (<TextContent key={idx+'h'}>
                    <Text component="a" href={'/api/v1/components/' + p.key + '/fedramp/High'}><FileWordIcon/> .docx</Text>
                </TextContent>),
            ];
        })});
    }
    render() {
        const textMod = {modifier: 'flex-2' as 'flex-default', breakpoint: 'md' as 'md'};
        const emptyMod = {modifier: 'flex-1' as 'flex-default', breakpoint: 'md' as 'md'};
        return (
            <Page>
                <PageSection variant={PageSectionVariants.light}>
                    <Flex>
                        <Flex>
                            <FlexItem>
                                <TextContent>
                                    <Text component="h1">FedRAMP Templates</Text>
                                    <Text component="p">
                                        The FedRAMP template is dynamically generated using the <Text component="a" href="https://github.com/opencontrol/fedramp-templater">OpenControl FedRAMP Templater</Text> tool, originally created by <Text component="a" href="https://18f.gsa.gov/">GSA's 18F</Text>. An automated build system incorporates <Text component="a" href="https://github.com/ComplianceAsCode/redhat">Red Hat's OpenControl Content</Text> directly into the FedRAMP Templates <Text component="a" href="https://www.fedramp.gov/templates/">provided by the GSA FedRAMP PMO</Text>.
                                    </Text>
                                </TextContent>
                            </FlexItem>
                        </Flex>
                        <Flex>
                            <FlexItem/>
                        </Flex>
                    </Flex>

                    <TextContent>
                        <Table
                            caption="Download Section"
                            variant={TableVariant.compact}
                            rows={this.state.rows}
                            cells={this.columns}>
                            <TableHeader />
                            <TableBody />
                        </Table>
                    </TextContent>
                </PageSection>
            </Page>
        )
    }
}

export { ComponentFedRAMPTemplates };
