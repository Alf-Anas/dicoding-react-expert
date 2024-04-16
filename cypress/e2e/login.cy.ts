/**
 * - Login spec
 *   - should display login page correctly
 *   - should display alert when email is empty
 *   - should display alert when password is empty
 *   - should display alert when email and password are wrong
 *   - should display profile page when email and password are correct
 */

describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');

    // Wait until the document is ready
    cy.document().should('exist').its('readyState').should('equal', 'complete');
  });

  it('should display login page correctly', () => {
    // memverifikasi elemen yang harus tampak pada halaman login
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button')
      .contains(/^Login$/)
      .should('be.visible');
  });

  it('should display alert when email is empty', () => {
    // check jika input tersedia dan menunggu 1 detik (menunggu library antd selesai loading)
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.wait(1000);

    // klik tombol login tanpa mengisi email
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // memverifikasi antd message untuk menampilkan pesan error
    cy.contains('.ant-message', 'Email and Password must not empty!').should(
      'be.visible',
    );
  });

  it('should display alert when password is empty', () => {
    // mengisi email
    cy.get('input[placeholder="Email"]').type('user01@mail.com');

    // klik tombol login tanpa mengisi password
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // memverifikasi antd message untuk menampilkan pesan error
    cy.contains('.ant-message', 'Email and Password must not empty!').should(
      'be.visible',
    );
  });

  it('should display alert when email and password are wrong', () => {
    // mengisi email
    cy.get('input[placeholder="Email"]').type('user01@mail.com');

    // mengisi password yang salah
    cy.get('input[placeholder="Password"]').type('wrong_password');

    // menekan tombol Login
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // memverifikasi antd message untuk menampilkan pesan error dari API
    cy.contains('.ant-message', /email or password is wrong/).should(
      'be.visible',
    );
  });

  it('should display profile page when email and password are correct', () => {
    // mengisi email
    cy.get('input[placeholder="Email"]').type('user01@mail.com');

    // mengisi password
    cy.get('input[placeholder="Password"]').type('abcd1234');

    // menekan tombol Login
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // menunggu hingga URL berubah ke halaman profil
    cy.url().should('contain', '/profile');

    // memverifikasi bahwa elemen yang berada di profile page ditampilkan
    cy.get('button')
      .contains(/^Logout$/)
      .should('be.visible');
    cy.contains('user01@mail.com').should('be.visible');
  });
});
