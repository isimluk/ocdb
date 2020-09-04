import * as React from 'react';
import { SimpleAboutModal } from '@app/AppLayout/About'
import {
  Page,
  PageHeader,
  PageSidebar,
  SkipToContent,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from '@patternfly/react-core';
import { InteractiveNavigation } from '@app/AppLayout/Navigation'
import { ProductSelector } from '@app/AppLayout/ProductSelector'

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({children}) => {
  const logoProps = {
    href: '/',
    target: '_blank'
  };
  const [isNavOpen, setIsNavOpen] = React.useState(true);
  const [isMobileView, setIsMobileView] = React.useState(true);
  const [isNavOpenMobile, setIsNavOpenMobile] = React.useState(false);
  const onNavToggleMobile = () => {
    setIsNavOpenMobile(!isNavOpenMobile);
  };
  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  }
  const onPageResize = (props: { mobileView: boolean; windowSize: number }) => {
    setIsMobileView(props.mobileView);
  };

    const pageHeaderTools = (
        <PageHeaderTools>
            <PageHeaderToolsGroup>
                <PageHeaderToolsItem>
                    <ProductSelector/>
                </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
            <PageHeaderToolsGroup>
                <PageHeaderToolsItem>
                    <SimpleAboutModal/>
                </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
        </PageHeaderTools>
    );

    const Header = (
        <PageHeader
            logo="Red Hat's ATO PathWays"
            logoProps={logoProps}
            headerTools={pageHeaderTools}
            showNavToggle={true}
            isNavOpen={isNavOpen}
            onNavToggle={isMobileView ? onNavToggleMobile : onNavToggle}
        />
    );

  const Sidebar = (
    <PageSidebar
      nav={<InteractiveNavigation/>}
      isNavOpen={isMobileView ? isNavOpenMobile : isNavOpen} theme="dark" />
  );
  const PageSkipToContent = (
    <SkipToContent href="#primary-app-container">
      Skip to Content
    </SkipToContent>
  );
  return (
    <Page
      mainContainerId="primary-app-container"
      header={Header}
      sidebar={Sidebar}
      onPageResize={onPageResize}
      skipToContent={PageSkipToContent}>
      {children}
    </Page>
  );
}

export { AppLayout };
