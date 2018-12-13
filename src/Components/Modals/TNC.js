import React, {Component} from 'react';
import {ScrollView, Text, TouchableOpacity, View, Linking} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './ModalStyles';
import {showModal} from "../../Redux/App";

class TNC extends Component {
  constructor() {
    super();
    this.state = {}
  }

  render() {
    return (
      <View style={styles.tncModal}>
        <ScrollView>
          <Text style={styles.tncHeadingBig}>Terms of Use</Text>
          <Text style={styles.tncHeadingSmall}>Agreement to terms:</Text>
          <Text style={styles.tncText}>These terms and conditions outline the rules and regulations for the use of
            ClassCast's Website and mobile-based application. By accessing this website we assume you accept these terms
            and conditions in full. Do not continue to use ClassCast's application if you do not accept all of the terms
            and conditions stated on this page.</Text>
          <Text style={styles.tncText}>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and
            any or all Agreements:
          </Text>
          <Text style={styles.tncText}>
            “Client”, “You” and “Your” refers to you, the person accessing this website and accepting the Company’s
            terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”,
            “Parties”, or “Us”, refers to both the Client and ourselves, or either the Client or ourselves.
          </Text>
          <Text style={styles.tncText}>
            All terms refer to the offer, acceptance and consideration of payment necessary to undertake
            the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a
            fixed duration, or any other means, for the express purpose of meeting the Client’s needs in respect of
            provision of the Company’s stated services/products, in accordance with and subject to, prevailing law of
            India. Any use of the above terminology or other words in the singular, plural, capitalisation and/or he/she
            or they, are taken as interchangeable and therefore as referring to same.
          </Text>

          <Text style={styles.tncHeadingSmall}>Cookies</Text>
          <Text style={styles.tncText}>
            We employ the use of cookies. By using ClassCast's application you consent to the use of cookies in
            accordance with ClassCast’s privacy policy.Most of the modern day interactive application use cookies to
            enable us to retrieve user details for each visit. Cookies are used in some areas of our app to enable the
            functionality of this area and ease of use for those people visiting. Some of our affiliate / advertising
            partners may also use cookies.License
            Unless otherwise stated, ClassCast and/or it’s licensors own the intellectual property rights for
            all material on ClassCast. All intellectual property rights are reserved. You may view pages from
            http://www.classcast.in for your own personal use subject to restrictions set in these terms and conditions.
          </Text>
          <Text style={styles.tncText}>As a user, you agree not to:</Text>
          <Text style={styles.tncTextListItem}>
            1. Republish material from http://www.classcast.in
          </Text>
          <Text style={styles.tncTextListItem}>
            2. Sell, rent or sub-license material from http://www.classcast.in
          </Text>
          <Text style={styles.tncTextListItem}>
            3. Reproduce, duplicate or copy material from http://www.classcast.in. Redistribute content from ClassCast
            (unless content is specifically made for redistribution)
          </Text>
          <Text style={styles.tncTextListItem}>
            4. Hyperlinking to our Content
          </Text>
          <Text style={styles.tncText}>
            The following organizations may link to our Web site without prior written approval:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. Search engines
          </Text>
          <Text style={styles.tncTextListItem}>
            2. News organizations
          </Text>
          <Text style={styles.tncTextListItem}>
            3. Online directory distributors when they list us in the directory may link to our Web site in the same
            manner as they hyperlink to the Web sites of other listed businesses
          </Text>
          <Text style={styles.tncTextListItem}>
            4. Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and
            charity fundraising groups which may not hyperlink to our Web site.
          </Text>
          <Text style={styles.tncText}>
            These organizations may link to our home page, to publications or to other Web site information so long as
            the link:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. is not in any way misleading
          </Text>
          <Text style={styles.tncTextListItem}>
            2. does not falsely imply sponsorship, endorsement or approval of the linking party and its products or
            services
          </Text>
          <Text style={styles.tncTextListItem}>
            3. fits within the context of the linking party's site
          </Text>
          <Text style={styles.tncText}>
            We may consider and approve in our sole discretion other link requests from the following types of
            organizations:
          </Text>
          <Text style={styles.tncText}>
            commonly-known consumer and/or business information sources such as Chambers of Commerce, Indian Automobile
            Association, AARP and Consumers Union; dot.com community sites; associations or other groups representing
            charities, including charity giving sites,
            online directory distributors; internet portals; accounting, law and consulting firms whose primary clients
            are businesses; and educational institutions and trade associations.
          </Text>
          <Text style={styles.tncText}>
            We will approve link requests from these organizations if we determine that:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. the link would not reflect unfavorably on us or our accredited businesses (for example, trade
            associations or other organizations representing inherently suspect types of business, such as work-at-home
            opportunities, shall not be allowed to link)
          </Text>
          <Text style={styles.tncTextListItem}>
            2. the organization does not have an unsatisfactory record with us
          </Text>
          <Text style={styles.tncTextListItem}>
            3. the benefit to us from the visibility associated with the hyperlink outweighs the absence of; and
          </Text>
          <Text style={styles.tncTextListItem}>
            4. where the link is in the context of general resource information or is otherwise consistent with
            editorial content in a newsletter or similar product furthering the mission of the organization.
          </Text>
          <Text style={styles.tncText}>
            These organizations may link to our home page, to publications or to other Web site information so long as
            the link:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. is not in any way misleading
          </Text>
          <Text style={styles.tncTextListItem}>
            2. does not falsely imply sponsorship, endorsement or approval of the linking party and it products or
            services
          </Text>
          <Text style={styles.tncTextListItem}>
            3. fits within the context of the linking party's site.
          </Text>
          <Text style={styles.tncText}>
            If you are among the organizations listed in paragraph 2 above and are interested in linking to our website,
            you must notify us by sending an e-mail to prashant@classcast.in.
          </Text>
          <Text style={styles.tncText}>
            Please include your name, your organization name, contact information (such as a phone number and/or e-mail
            address) as well as the URL of your site, a list of any URLs from which you intend to link to our
            app/Website, and a list of the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a
            response.
          </Text>
          <Text style={styles.tncText}>
            Approved organizations may hyperlink to our Web site as follows:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. By use of our corporate name; or
          </Text>
          <Text style={styles.tncTextListItem}>
            2. By use of the uniform resource locator (Web address) being linked to; or
          </Text>
          <Text style={styles.tncTextListItem}>
            3. By use of any other description of our Web site or material being linked to that makes sense within the
            context and format of content on the linking party's site.
          </Text>
          <Text style={styles.tncText}>
            No use of ClassCast’s logo or other artwork will be allowed for linking absent a trademark license
            agreement.
          </Text>

          <Text style={styles.tncHeadingSmall}>Iframes</Text>

          <Text style={styles.tncText}>
            Without prior approval and express written permission, you may not create frames around our Web pages or use
            other techniques that alter in any way the visual presentation or appearance of our Web site.
          </Text>
          <Text style={styles.tncHeadingSmall}>Reservation of Rights</Text>

          <Text style={styles.tncText}>
            We reserve the right at any time and in its sole discretion to request that you remove all links or any
            particular link to our Web site. You agree to immediately remove all links to our Web site upon such
            request. We also reserve the right to amend these terms and conditions and its linking policy at any time.
            By continuing to link to our Web site, you agree to be bound to and abide by these linking terms and
            conditions.
          </Text>
          <Text style={styles.tncText}>
            Removal of links from our website If you find any link on our Web site or any linked web site objectionable
            for any reason, you may contact us about this. We will consider requests to remove links but will have no
            obligation to do so or to respond directly to you. Whilst we endeavour to ensure that the information on
            this website is correct, we do not warrant its completeness or accuracy; nor do we commit to ensuring that
            the website remains available or that the material on the website is kept up to date.
          </Text>
          <Text style={styles.tncHeadingSmall}>Content Liability</Text>

          <Text style={styles.tncText}>
            We shall have no responsibility or liability for any content appearing on your Web site. You agree to
            indemnify and defend us against all claims arising out of or based upon your Website. No link(s) may appear
            on any page on your Web site or within any context containing content or materials that may be interpreted
            as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or
            other violation of, any third party rights.
          </Text>
          <Text style={styles.tncTextListItem}>
            1. limit or exclude our or your liability for death or personal injury resulting from negligence;
          </Text>
          <Text style={styles.tncTextListItem}>
            2. limit or exclude our or your liability for fraud or fraudulent misrepresentation;
          </Text>
          <Text style={styles.tncTextListItem}>
            3. limit any of our or your liabilities in any way that is not permitted under applicable law; or
          </Text>
          <Text style={styles.tncTextListItem}>
            4. exclude any of our or your liabilities that may not be excluded under applicable law.
          </Text>
          <Text style={styles.tncText}>
            The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer:
          </Text>
          <Text style={styles.tncTextListItem}>
            1. are subject to the preceding paragraph; and
          </Text>
          <Text style={styles.tncTextListItem}>
            2. govern all liabilities arising under the disclaimer or in relation to the subject matter of this
            disclaimer, including liabilities arising in contract, in tort (including negligence) and for breach of
            statutory duty.
          </Text>
          <Text style={styles.tncText}>
            To the extent that the website and the information and services on the website are provided free of charge,
            we will not be liable for any loss or damage of any nature.
          </Text>

          <Text style={styles.tncHeadingSmall}>Credit & Contact Information</Text>

          <Text style={styles.tncText}>
            In order to resolve any complaint regarding the Site or to receive further information regarding the use of
            site, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>
            Beatrix Technologies Pvt. Ltd.
          </Text>
          <Text style={styles.contactInfo}>
            UU-195, Pitampura,
          </Text>
          <Text style={styles.contactInfo}>
            Delhi - 110034.
          </Text>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            this.props.showModal(null)
          }}
        >
          <View style={styles.tncButtonContainer}>
            <Text style={styles.tncButton}>Close</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
            Linking.openURL('http://classcast.in');
          }}
        >
          <View style={styles.tncButtonContainer}>
            <Text style={styles.tncButton}>Visit Website</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => bindActionCreators({
  showModal: showModal,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TNC);