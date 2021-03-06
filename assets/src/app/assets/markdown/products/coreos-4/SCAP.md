## SCAP

SCAP content for Red Hat Enterprise Linux CoreOS is being developed under [ComplianceAsCode project](https://github.com/ComplianceAsCode/content). Configuration compliance with the given SCAP content can be assessed automatically using [OpenSCAP tool](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/security_hardening/scanning-the-system-for-security-compliance-and-vulnerabilities_security-hardening).

Enterprising users are invited to early use of [compliance-operator](https://github.com/openshift/compliance-operator). Compliance-operator, when loading inside OpenShift cluster can be used to assess OpenShift nodes from inside the cluster. Compliance-operator is also able to remediate configuration setting using Ignition script language using Machine Config Operator directly.

### NIST National Checklist for Red Hat Enterprise Linux CoreOS

This is a *draft* profile. This profile reflects U.S. Government consensus content and is developed through the OpenSCAP/ComplianceAsCode initiative, championed by the National Security Agency. Latest version of the documents can be obtained from upstream project or under following links.

Available downloads:
 * Implementation Guide [HTML](/cac/guides/ssg-ocp4-guide-coreos-ncp.html)
 * SCAP content
   * All in one DataStream: [SCAP 1.3](/cac/ssg-ocp4-ds.xml), [SCAP 1.2](/cac/ssg-ocp4-ds-1.2.xml)
   * Checklist: [XCCDF 1.2](/cac/ssg-ocp4-xccdf-1.2.xml), [XCCDF 1.1](/cac/ssg-ocp4-xccdf.xml)
     * Assessment Details: [OVAL](/cac/ssg-ocp4-oval.xml)
     * Questionnaire: [OCIL](/cac/ssg-ocp4-ocil.xml)
 * All in one remediation scripts: [Ansible Playbook](/cac/ansible/ocp4-playbook-coreos-ncp.yml), [Bash](/cac/bash/ocp4-script-coreos-ncp.sh), [Ignition](/cac/ocp4/ignition-fixes.xml)
