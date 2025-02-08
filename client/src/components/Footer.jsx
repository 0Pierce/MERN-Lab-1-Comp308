import '/src/styles/footer.css';

export default function Footer() {
  return (
    <footer className="footerBody">
      <p>&copy; {new Date().getFullYear()} School. All rights reserved.</p>
      <p>Contact: contact@school.com | Phone: (123) 456-7890</p>
      <p>Follow us: <a href="#">Twitter</a> | <a href="#">LinkedIn</a></p>
    </footer>
  );
}
