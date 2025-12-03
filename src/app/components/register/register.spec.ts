import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent] // componente standalone
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial empty form fields', () => {
    expect(component.nombre).toBe('');
    expect(component.email).toBe('');
    expect(component.telefono).toBe('');
    expect(component.direccion).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('should alert if passwords do not match', () => {
    spyOn(window, 'alert');
    component.password = '123';
    component.confirmPassword = '456';
    component.onRegister();
    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
  });

  it('should log registration data if passwords match', () => {
    spyOn(console, 'log');
    spyOn(window, 'alert');
    component.nombre = 'Juan';
    component.email = 'juan@example.com';
    component.telefono = '999999999';
    component.direccion = 'Calle Falsa 123';
    component.password = 'abc';
    component.confirmPassword = 'abc';
    component.onRegister();
    expect(console.log).toHaveBeenCalledWith('Registro completo:', {
      nombre: 'Juan',
      email: 'juan@example.com',
      telefono: '999999999',
      direccion: 'Calle Falsa 123',
      password: 'abc'
    });
    expect(window.alert).toHaveBeenCalledWith('Registro exitoso (demo)');
  });
});
