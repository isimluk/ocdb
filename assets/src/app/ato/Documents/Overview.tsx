import * as React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { Page,
         Card,
         CardBody,
         CardHeader,
         Gallery,
         GalleryItem,
         TextContent,
         Text,
} from '@patternfly/react-core';
import { NavLink } from 'react-router-dom';
import { BookReaderIcon, GhostIcon } from '@patternfly/react-icons';

const ATODocuments: React.FunctionComponent<any> = (props) => {
    return (
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">ATO Documents</Text>
                    <Text component="h2">A&amp;A Templates</Text>
                    <Text component="p">
                        Red Hat Public Sector is in the process of open sourcing ATO artifacts.
                        Developed with US Government agencies and system integrators, these templates are
                        tailored for the operation of Red Hat technologies and complement
                        organizational-level policies and procedures.</Text>
                    <Text component="p">
                        Many of these documents are undergoing prepublication review for open source release.
                        As that happens they will be posted here!</Text>
                </TextContent>
            </PageSection>

            <PageSection>
                <Gallery hasGutter>
                    
                    <GalleryItem>
                        <Card isHoverable>
                            <CardHeader>
                                <GhostIcon/>&nbsp;
                                <NavLink exact={true} to="/ato/documents/vulnerability-management-plan">
                                    Vulnerability Management
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                The vulnerability management process begins with vulnerabilities being identified or reported to Red Hat’s Product Security team.
                            </CardBody>
                        </Card>
                    </GalleryItem>

                    <GalleryItem>
                        <Card isHoverable>
                            <CardHeader>
                                <BookReaderIcon/>&nbsp;
        <NavLink exact={true} to="/ato/documents/security-awareness-and-training-plan">
            Security Awareness
        </NavLink>
                            </CardHeader>
                            <CardBody>
                                This resource has been compiled to assist with Security Awareness Training requirements.
                            </CardBody>
                        </Card>
                    </GalleryItem>

                </Gallery>
            </PageSection>

        </Page>
    );
}

export { ATODocuments };
