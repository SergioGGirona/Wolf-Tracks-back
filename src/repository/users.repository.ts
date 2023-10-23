import { User } from '../entities/user.js';
import { transporter } from '../helpers/mail.js';
import { HttpError } from '../types/error.js';
import { Suscriptor } from '../types/suscriptor.js';
import { Repository } from './repository.js';
import { UserModel } from './users.model.js';

export class UsersRepository implements Repository<User> {
  async getAll(): Promise<User[]> {
    const data = await UserModel.find()
      .populate('wolves', { nickname: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('wolves', { nickname: 1 })
      .exec();
    if (!data) {
      throw new HttpError(
        404,
        'Not found',
        "User not found. Don't you know your work mates?",
        { cause: 'Trying getByID method' }
      );
    }

    return data;
  }

  async create(newData: Omit<User, 'id'>): Promise<User> {
    const data = await UserModel.create(newData);
    return data;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, { new: true })
      .populate('wolves', { nickname: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying update method',
      });
    return data;
  }

  async login({ key, value }: { key: string; value: string }): Promise<User> {
    const data = await UserModel.findOne({ [key]: value }).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying login method',
      });
    return data;
  }

  async suscribe(newData: Suscriptor) {
    const { userName, email } = newData;

    await transporter.sendMail({
      from: `Sergio G. Girona ${process.env.EMAIL}`,
      to: email,
      subject: 'WolfTracks, un proyecto de Sergio G. Girona',
      text: `Hola ${userName}, gracias por tu interés.
      He trabajado en este proyecto con cariño, si quieres saber más sobre mí, visita mi LinkedIn: https://www.linkedin.com/in/sergiogonzalezgirona/`,
      html: `
        <div style="text-align: center;">
          <img src="https://res.cloudinary.com/dn5pxi50z/image/upload/v1696935314/favicon_pmfgdy.png" alt="Icono de Wolf Tracks" style="max-width: 100px; display: block; margin: 0 auto;">
        </div>
        <p>Hola ${userName},</p>
        <p>Gracias por tu interés, he dedicado mucho esfuerzo y cariño a este proyecto y estoy emocionado por compartirlo contigo. Si quieres conocer más sobre mi trayectoria y experiencia, te invito a visitar mis perfiles en LinkedIn y GitHub, donde podrás conocer más acerca de mí y mi experiencia:</p>
        <p><a href="https://www.linkedin.com/in/sergiogonzalezgirona/">LinkedIn</a></p>
        <p><a href="https://github.com/SergioGGirona/">GitHub</a></p>
        <p>¡Espero que te haya gustado! ¿Nos ponemos en contacto?</p>
        <span>Sergio G. Girona</span>
  `,
    });

    await transporter.sendMail({
      from: `Sergio G. Girona ${process.env.EMAIL}`,
      to: `${process.env.EMAIL}`,
      subject: 'Alguien ha mirado WolfTracks',
      text: `Alguien ha mirado y se ha suscrito a WolfTracks. Nombre: ${userName}, email: ${email}`,
    });
  }
}
